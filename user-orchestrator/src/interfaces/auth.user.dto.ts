
export type UserInfo = {
    id?: number
    email: string
    password: string
    fullName: string
    phone: string
    verified: boolean
    status: boolean
    parent_user_id?: number;
    loginType?: 'master' | 'employee'
    store?: { store_id: number, store_detail: StoreDetail }
}

type StoreDetail = {
    id: number
    userId: number
    storeName: string
}