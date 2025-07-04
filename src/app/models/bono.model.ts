export interface Bono {
    bond_id: number;
    user_id: number;
    face_value: number;
    commercial_value: number;
    years: number;
    coupon_frequency: number;
    capitalization_days: number;
    interest_rate_type: string;
    annual_rate: number;
    discount_rate: number;
    interest_tax: number;
    issue_date: string; // o Date si prefieres
}
