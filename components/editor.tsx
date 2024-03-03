"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";

import { useBlockNote, BlockNoteView } from "@blocknote/react";
import "@blocknote/core/style.css";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
	initialContent?: string;
	editable?: boolean;
	onChange: (value: string) => void;
}

export function Editor({ editable, initialContent, onChange }: EditorProps) {
	const { resolvedTheme } = useTheme();
	const { edgestore } = useEdgeStore();

	const handleUpload = async (file: File) => {
		const respone = await edgestore.publicFiles.upload({
			file,
		});

		return respone.url;
	};

	const editor: BlockNoteEditor = useBlockNote({
		editable,
		initialContent: initialContent
			? (JSON.parse(initialContent) as PartialBlock[])
			: undefined,
		onEditorContentChange(editor) {
			onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
		},
		uploadFile: handleUpload,
	});

	if (document === undefined) return <p>Loading...</p>;

	return (
		<div>
			<BlockNoteView
				editor={editor}
				theme={resolvedTheme === "dark" ? "dark" : "light"}
			/>
		</div>
	);
}
