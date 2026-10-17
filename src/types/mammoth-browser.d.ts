declare module "mammoth/mammoth.browser.js" {
  interface MammothBrowser {
    extractRawText: (input: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
  }
  const mammoth: MammothBrowser;
  export default mammoth;
}
