import { ScriptData } from './schema/script'
import { CouponData } from './schema/coupon'
import { Item, ItemCoupon, ItemScript } from './schema/item'
import { Cart, CartItem } from './schema/cart'
import { ScriptType, CouponApplication, CouponDuration, CouponType, Status } from './schema/types'
import { User, UserCredentials, UserProvider } from './schema/user'

import type { TvComment, TvIdeaMisc, TvImage, TvScript, TvScriptUpdate, TvSymbol, TvTag, TvUser } from './tradingview/types'

export {
    CouponData as Coupon,
    ScriptData as Script,
    Cart, CartItem,
    Item, ItemScript, ItemCoupon,
    ScriptType, CouponApplication, CouponType, Status, CouponDuration,
    User, UserCredentials, UserProvider
}

export type {
    TvComment, TvIdeaMisc, TvImage, TvScript, TvScriptUpdate, TvSymbol, TvTag, TvUser
}

export default {
    Coupon: CouponData,
    Script: ScriptData,
    Cart, CartItem,
    Item, ItemScript, ItemCoupon,
    ScriptType, CouponApplication, CouponType, Status, CouponDuration,
    User, UserCredentials, UserProvider,
}