export type TileSize = {
    colSpan: number
    rowSpan?: number
}

export type BaseTile = {
    id: string
    size: TileSize
    title: string
}

export type StatTileData = BaseTile & {
    kind: 'stat'
    labels: string[]
    values: (string | number)[]
    lastUpdatedText?: string
    showMiniGraph?: boolean
}

export type OverviewTileData = BaseTile & {
    kind: 'overview'
    result: string | number
    notes?: string
    timeText?: string
    onAdd?: () => void
}

export type GenericTileData = BaseTile & {
    kind: 'generic'
    body?: React.ReactNode
    backgroundColor?: string
    borderColor?: string
}

export type DashboardTile = StatTileData | OverviewTileData | GenericTileData
