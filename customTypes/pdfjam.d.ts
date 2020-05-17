declare module 'pdfjam' {
    export const nup: (path: string, h: number, w: number, config: {
        outfile: string
    }) => Promise<void>;
}