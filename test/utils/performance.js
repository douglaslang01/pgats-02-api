const configLocal = JSON.parse(open('../config/config.local.json'));

export function getBaseUrl() {
    return __ENV.BASE_URL || configLocal.baseUrl;
}
