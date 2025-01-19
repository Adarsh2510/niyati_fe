export const getNiyatiBackendApiUrl = (
    endpoint: string,
    params?: { [_key: string]: string }
) => {
    const url = new URL(endpoint, process.env.NEXT_PUBLIC_BE_ENDPOINT);
    if (params) {
        url.search = new URLSearchParams(params).toString();
    }
    return url.toString();
}
