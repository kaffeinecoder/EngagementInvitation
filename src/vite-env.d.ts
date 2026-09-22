/// <reference types="vite/client" />

declare module '*.css';
declare module '*.mpeg' {
	const source: string;
	export default source;
}
declare module '*.mp4' {
	const source: string;
	export default source;
}
