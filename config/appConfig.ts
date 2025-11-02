// This file centralizes the configuration structure for the application.

// A generic, universal template for a platform's environmental configuration.
export interface PlatformEnvironmentConfig {
    credentials: {
        [key: string]: string; // e.g., app_id, app_secret, consumer_key
    };
    tokens: {
        [key: string]: string; // e.g., user, page, access_token
    };
    oauth: {
        redirect_uri: string;
        scopes: string;
    };
}

export interface PlatformConfig {
    dev: PlatformEnvironmentConfig;
    live?: PlatformEnvironmentConfig;
}

// Now includes brand-specific details like logo and description.
export interface BrandConfig {
    details: {
        name: string;
        logoUrl: string;
        description: string;
    };
    platforms: {
        [platform: string]: PlatformConfig;
    };
}

export interface UserConfig {
    brands: {
        [brandName: string]: BrandConfig;
    };
}

export interface AppConfig {
    last_saved: string;
    current_selection: {
        user: string;
        brand: string;
        platform: string;
    };
    users: {
        [userName: string]: UserConfig;
    };
}

// Default empty structure for a new platform configuration, using the universal template.
const createEmptyPlatformConfig = (): PlatformConfig => ({
    dev: {
        credentials: { app_id: "", app_secret: "" },
        tokens: { user: "", page: "" },
        oauth: { redirect_uri: "http://localhost:8080/auth/callback", scopes: "" }
    },
    live: {
        credentials: { app_id: "", app_secret: "" },
        tokens: { user: "", page: "" },
        oauth: { redirect_uri: "https://your-app.com/auth/callback", scopes: "" }
    }
});

// The initial state of the application configuration, loaded on startup.
export const initialAppConfig: AppConfig = {
    "last_saved": "2025-11-01T03:29:23.713Z",
    "current_selection": {
        "user": "rakesh",
        "brand": "mv",
        "platform": "Facebook"
    },
    "users": {
        "default_user": {
            "brands": {
                "DefaultBrand": {
                    details: {
                        name: "Default Brand",
                        logoUrl: "",
                        description: "A default brand for general use."
                    },
                    platforms: {
                        "Facebook": createEmptyPlatformConfig(),
                        "Instagram": createEmptyPlatformConfig(),
                        "Pinterest": createEmptyPlatformConfig(),
                    }
                }
            }
        },
        "rakesh": {
            "brands": {
                "mv": {
                    details: {
                        name: "MV",
                        logoUrl: "https://img.icons8.com/plasticine/100/m.png",
                        description: "Main brand for Rakesh's projects."
                    },
                    platforms: {
                        "Facebook": {
                            "dev": {
                                "credentials": {
                                    "app_id": "1268753368113520",
                                    "app_secret": "301460da7166044fe2f25515fde0144c",
                                    "page_id": "111111111111111",
                                    "group_id": "222222222222222"
                                },
                                "tokens": {
                                    "user": "EAASB7KnQYXABPZCnPkmeyAZCKLgJVoLTwISDbiM3E8mSde85YEwh9MiWGkFVKLU6Xbx8MB7GxdTZBmT9GsLONZCKP01eRzxXFEPsiX5qq709bUPofCObPf40JMRvvKZBPcKosZBMtavkzyUcNfXkpHgej2AAZAkcFVuY8jWCvLHDfmtAmBwqAtLzgHaVszmXCfHnNa8A9DH7r5dz3BZCA6YBHqXZCtWqm4Tgnppnh5ZBCGhWbcKy7JNR0qZCkUyMvHBN8Xl1TCgDmLBkNASoMnZBjTfZBN30ovCRNfyT3cgAD",
                                    "page": "EAASB7KnQYXABP6NI15Ma8I2KHOTx2eIm0qX2VYKJYNeqPRZBMO3UnVz8FJzQUoFZBt0iuZBKMJGQhQYZB4GV4KJLdR3ljuPX7QDsfq78hadgroGIzWodigVM9EiNkohJ6ZBw2DTMtZCIdqiraBmg3rY0FTUoFDYE5LZBtarL9qFUZAjtR7etVlpBCZCF5fUFAvp20jLRz9VOMUr4d"
                                },
                                "oauth": {
                                    "redirect_uri": "http://localhost:8080/auth/facebook/callback",
                                    "scopes": "pages_manage_posts,publish_video,pages_read_engagement,pages_show_list,publish_to_groups,groups_access_member_info"
                                }
                            },
                            "live": createEmptyPlatformConfig().dev
                        },
                        "Instagram": createEmptyPlatformConfig(),
                        "Pinterest": {
                             "dev": {
                                "credentials": { app_id: "", app_secret: "" },
                                "tokens": { user: "" },
                                "oauth": { redirect_uri: "http://localhost:8080/auth/pinterest/callback", scopes: "pins:read,pins:write" }
                            },
                            "live": createEmptyPlatformConfig().dev
                        },
                    }
                }
            }
        }
    }
};