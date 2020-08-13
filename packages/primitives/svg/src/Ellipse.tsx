import React, { FC, SVGProps } from 'react'

export const Ellipse: FC<SVGProps<SVGEllipseElement>> = (props) => <ellipse {...props}/>

Ellipse.displayName = 'Ellipse'
