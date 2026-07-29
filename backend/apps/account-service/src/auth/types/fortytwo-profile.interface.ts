export interface FortyTwoProfile {
  id: number;
  login: string;
  email: string;
  coalition_id?: number;
  coalition_name?: string;
  image?: {
    link: string;
    versions: {
      large: string;
      medium: string;
      small: string;
      micro: string;
    };
  };
}

export interface FortyTwoTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  created_at: number;
}

export interface FortyTwoCoal {
  id: number;
  name: string;
}
