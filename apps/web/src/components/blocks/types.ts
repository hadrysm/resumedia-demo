import type { LocaleCode } from '@resumedia-demo/shared/locales'
import type { Page, Tenant } from '@resumedia-demo/shared/payload-types'

export type Block = NonNullable<Page['layout']>[number]
export type BlockType = Block['blockType']
export type BlockOf<K extends BlockType> = Extract<Block, { blockType: K }>

export type BlockContext = { tenant: Tenant; locale: LocaleCode }
export type BlockProps<K extends BlockType> = { block: BlockOf<K>; ctx: BlockContext }
