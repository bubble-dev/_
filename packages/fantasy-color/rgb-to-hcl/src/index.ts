import { RGB, HCL } from '@fantasy-color/types'
import rgbToLab from '@fantasy-color/rgb-to-lab'
import labToHcl from '@fantasy-color/lab-to-hcl'

export default (color: RGB): HCL => labToHcl(rgbToLab(color))
