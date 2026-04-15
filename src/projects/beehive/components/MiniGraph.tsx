// PLACEHOLDER FOR NOW

import React from 'react'

type Props = {
    height?: number
}

export const MiniGraphPlaceholder = ({ height = 48 }: Props) => {
    const boxStyle: React.CSSProperties = {
        height,
        width: '100%',
        borderRadius: 10,
        border: '1px solid rgba(0,0,0,0.12)',
        background: 'rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        userSelect: 'none',
    }

    return <div style={boxStyle}>Mini graph placeholder</div>
}
