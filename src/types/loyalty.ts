export interface LoyaltyUserPointsResponse {
  points: number;
}

export interface LoyaltyPointTransactionDTO {
  id: string;
  points: number;
  transactionDate: string;
  description: string;
}

export interface LoyaltyTierDTO {
  id: number;
  tierName: string;
  isActive: boolean;
  isSpecial: boolean;
  noOfPurchaseFrom: number;
  noOfPurchaseTo: number;
  sellingPrice: number;
  orgId: number;
  cashBackPercentage: number;
  constraints: Record<string, number>;
  operation: string;
}

export interface CheckoutRewardDto {
  orderAmount: number;
}

export interface CheckoutRewardResponseDto {
  rewardPoints: number;
  message: string;
}

export interface OrganizationLoyaltyWalletDto {
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  walletIcon?: File;
  walletLogo?: File;
  walletCoverImage?: File;
}

export interface SharePointsRequest {
  orgId: number;
  email: string;
  points: number;
}