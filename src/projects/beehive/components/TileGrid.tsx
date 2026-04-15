import React from 'react'
import { DashboardTile } from '../types/dashboard'

type Props = {
    tiles: DashboardTile[]
    columns?: number
    gapPx?: number
    renderTile: (tile: DashboardTile) => React.ReactNode
}

export const TileGrid = ({
    tiles,
    columns = 12,
    gapPx = 16,
    renderTile,
}: Props) => {
    const gridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gapPx}px`,
        width: '100%',
        alignItems: 'stretch',
    }

    return (
        <div style={gridStyle}>
            {tiles.map(tile => {
                const itemStyle: React.CSSProperties = {
                    gridColumn: `span ${tile.size.colSpan}`,
                    gridRow: tile.size.rowSpan ? `span ${tile.size.rowSpan}` : undefined,
                    minWidth: 0,
                }

                return (
                    <div key={tile.id} style={itemStyle}>
                        {renderTile(tile)}
                    </div>
                )
            })}
        </div>
    )
}
