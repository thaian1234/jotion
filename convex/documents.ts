import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { z } from "zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { zCustomMutation, zid } from "convex-helpers/server/zod";

export const createDocument = mutation({
	args: {
		title: v.string(),
		parentDocument: v.optional(v.id("documents")),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error("Unauthenticated");
		}
		const userId = identity.subject;

		const document = await ctx.db
			.insert("documents", {
				title: args.title,
				parentDocument: args.parentDocument,
				userId,
				isArchived: false,
				isPublished: false,
			})
			.catch(() => {
				throw new Error("Cannot create document");
			});
		return document;
	},
});

export const getSidebar = query({
	args: {
		parentDocument: v.optional(v.id("documents")),
	},
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return null;
		const userId = identity.subject;

		const document = await ctx.db
			.query("documents")
			.withIndex("by_user_parent", (q) =>
				q.eq("userId", userId).eq("parentDocument", args.parentDocument)
			)
			.filter((q) => q.eq(q.field("isArchived"), false))
			.order("desc")
			.collect()
			.catch(() => {
				return [];
			});

		return document;
	},
});

export const archive = mutation({
	args: { id: v.id("documents") },
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("unauthenticated");
		const userId = identity.subject;

		const existingDocument = await ctx.db.get(args.id);
		if (!existingDocument) throw new Error("Document not found");

		if (existingDocument.userId !== userId) {
			throw new Error("Unauthrorized");
		}

		const recursiveArchive = async (documentId: Id<"documents">) => {
			const children = await ctx.db
				.query("documents")
				.withIndex("by_user_parent", (q) =>
					q.eq("userId", userId).eq("parentDocument", documentId)
				)
				.collect();

			for (const child of children) {
				await ctx.db.patch(child._id, {
					isArchived: true,
				});
				await recursiveArchive(child._id);
			}
		};

		const document = await ctx.db.patch(args.id, {
			isArchived: true,
		});

		recursiveArchive(args.id);

		return document;
	},
});

export const getTrash = query({
	async handler(ctx) {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("unauthenticated");
		const userId = identity.subject;

		const documents = await ctx.db
			.query("documents")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.filter((q) => q.eq(q.field("isArchived"), true))
			.order("desc")
			.collect()
			.catch(() => {
				throw new Error("Failed to get trash documents");
			});

		return documents;
	},
});

export const restore = mutation({
	args: {
		id: v.id("documents"),
	},
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("unauthenticated");
		const userId = identity.subject;

		const existingDocument = await ctx.db.get(args.id);

		if (!existingDocument) {
			throw new Error("Not found");
		}

		if (existingDocument.userId !== userId) {
			throw new Error("Unauthorized");
		}

		const recursiveRestore = async (documentId: Id<"documents">) => {
			const children = await ctx.db
				.query("documents")
				.withIndex("by_user_parent", (e) =>
					e.eq("userId", userId).eq("parentDocument", documentId)
				)
				.collect()
				.catch(() => {
					throw new Error("Documents not found");
				});

			for (const child of children) {
				await ctx.db
					.patch(child._id, {
						isArchived: false,
					})
					.catch(() => {
						throw new Error("Failed to update documents");
					});

				recursiveRestore(child._id);
			}
		};

		const options: Partial<Doc<"documents">> = {
			isArchived: false,
		};

		if (existingDocument.parentDocument) {
			const parent = await ctx.db.get(existingDocument.parentDocument);
			if (parent?.isArchived) {
				options.parentDocument = undefined;
			}
		}

		const document = await ctx.db.patch(args.id, options).catch(() => {
			throw new Error("Failed to update documents");
		});

		recursiveRestore(args.id);

		return document;
	},
});

export const remove = mutation({
	args: { id: v.id("documents") },
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthenticated");
		const userId = identity.subject;

		const existingDocument = await ctx.db.get(args.id);
		if (!existingDocument) {
			throw new Error("Not found");
		}

		if (existingDocument.userId !== userId) {
			throw new Error("Unauthorized");
		}

		const document = await ctx.db.delete(args.id).catch(() => {
			throw new Error("Failed to delete document");
		});

		return document;
	},
});

export const getSearch = query({
	async handler(ctx) {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthenticated");
		const userId = identity.subject;

		const documents = await ctx.db
			.query("documents")
			.withIndex("by_user", (e) => e.eq("userId", userId))
			.filter((q) => q.eq(q.field("isArchived"), false))
			.order("desc")
			.collect()
			.catch(() => {
				throw new Error("Cannot get documents");
			});

		return documents;
	},
});

export const getById = query({
	args: { documentId: v.id("documents") },
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();
		const document = await ctx.db.get(args.documentId);

		if (!document) throw new Error("Not not found");

		if (document.isPublished && !document.isArchived) {
			return document;
		}

		if (!identity) {
			return null;
		}

		const userId = identity.subject;
		if (document.userId !== userId) return null;

		return document;
	},
});

export const update = mutation({
	args: {
		id: v.id("documents"),
		title: v.optional(v.string()),
		content: v.optional(v.string()),
		coverImage: v.optional(v.string()),
		icon: v.optional(v.string()),
		isPublished: v.optional(v.boolean()),
	},
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthenticated");
		const userId = identity.subject;

		const { id, ...rest } = args;
		const existingDocument = await ctx.db.get(args.id);
		if (!existingDocument) throw new Error("Not found");

		if (existingDocument.userId !== userId) {
			throw new Error("unauthorized");
		}

		const document = await ctx.db.patch(args.id, { ...rest }).catch(() => {
			throw new Error("Failed to update document");
		});
		return document;
	},
});

export const removeIcon = mutation({
	args: { id: v.id("documents") },
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthenticated");
		const userId = identity.subject;

		const existingDocument = await ctx.db.get(args.id);

		if (!existingDocument) {
			throw new Error("Document not found");
		}

		if (existingDocument.userId !== userId) {
			throw new Error("Unauthorized");
		}

		const document = await ctx.db
			.patch(args.id, {
				icon: undefined,
			})
			.catch(() => {
				throw new Error("Failed to delete icon");
			});

		return document;
	},
});

export const removeCoverImage = mutation({
	args: { id: v.id("documents") },
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthenticated");
		const userId = identity.subject;

		const existingDocument = await ctx.db.get(args.id);

		if (!existingDocument) throw new Error("Document not found");
		if (existingDocument.userId !== userId) throw new Error("Unauthorized");

		const document = await ctx.db.patch(args.id, {
			coverImage: undefined,
		});

		return document;
	},
});
