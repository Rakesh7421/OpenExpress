
import { BrandConfig, PlatformConfig } from "../types";

export interface AppConfig {
  current_selection: {
    user: string;
    brand: string;
  };
  users: {
    [user: string]: {
      brands: {
        [brand: string]: BrandConfig;
      };
    };
  };
}

export const initialAppConfig: AppConfig = {
  current_selection: {
    user: 'Tempo',
    brand: 'OpenExpress',
  },
  users: {
    Tempo: {
      brands: {
        OpenExpress: {
          details: {
            name: 'OpenExpress',
            logoUrl: 'https://raw.githubusercontent.com/m3hr1n/OpenExpress/main/assets/logo.png',
            description: 'An open-source content creation and scheduling platform.',
            postingDefaults: {
              defaultAccounts: [],
              mandatoryHashtags: '#OpenExpress #ContentCreation',
            }
          },
          platforms: {
            Meta: {
              dev: {
                credentials: { app_id: '', app_secret: '', page_id: '', group_id: '' },
                tokens: { user: '', page: '' },
                oauth: { redirect_uri: 'http://localhost:3001/auth/facebook/callback', scopes: 'pages_show_list,pages_manage_posts,publish_video,pages_read_engagement' },
              },
              live: {
                credentials: { app_id: '', app_secret: '', page_id: '', group_id: '' },
                tokens: { user: '', page: '' },
                oauth: { redirect_uri: '', scopes: '' },
              },
            },
            X: {
                dev: {
                    credentials: { consumer_key: '', consumer_secret: '' },
                    tokens: { access_token: '', access_token_secret: '' },
                    oauth: { redirect_uri: 'http://localhost:3001/auth/twitter/callback', scopes: 'tweet.read,tweet.write,users.read' },
                },
                live: {
                    credentials: { consumer_key: '', consumer_secret: '' },
                    tokens: { access_token: '', access_token_secret: '' },
                    oauth: { redirect_uri: '', scopes: '' },
                }
            },
            LinkedIn: {
                dev: {
                    credentials: { app_id: '', app_secret: '' },
                    tokens: { user: '' },
                    oauth: { redirect_uri: 'http://localhost:3001/auth/linkedin/callback', scopes: 'r_liteprofile,w_member_social' },
                },
                live: {
                    credentials: { app_id: '', app_secret: '' },
                    tokens: { user: '' },
                    oauth: { redirect_uri: '', scopes: '' },
                }
            },
            TikTok: {
                dev: {
                    credentials: { app_id: '', app_secret: '' },
                    tokens: { user: '' },
                    oauth: { redirect_uri: 'http://localhost:3001/auth/tiktok/callback', scopes: 'user.info.basic' },
                },
                live: {
                    credentials: { app_id: '', app_secret: '' },
                    tokens: { user: '' },
                    oauth: { redirect_uri: '', scopes: '' },
                }
            },
            Instagram: {
                dev: {
                    credentials: { app_id: '', app_secret: '' },
                    tokens: { user: '' },
                    oauth: { redirect_uri: 'http://localhost:3001/auth/facebook/callback', scopes: 'instagram_basic,instagram_content_publish,pages_show_list' },
                },
                live: {
                    credentials: { app_id: '', app_secret: '' },
                    tokens: { user: '' },
                    oauth: { redirect_uri: '', scopes: '' },
                }
            },
            Pinterest: {
                dev: {
                    credentials: { app_id: '', app_secret: '' },
                    tokens: { user: '' },
                    oauth: { redirect_uri: 'http://localhost:3001/auth/pinterest/callback', scopes: 'pins:read,pins:write,boards:read,boards:write' },
                },
                live: {
                    credentials: { app_id: '', app_secret: '' },
                    tokens: { user: '' },
                    oauth: { redirect_uri: '', scopes: '' },
                }
            }
          },
        },
      },
    },
  },
};
