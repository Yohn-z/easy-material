interface TextWidthCalculatorStyleProps {
  fontSize?: number
  fontStyle?: string
  fontWeight?: string
  lineHeight?: number
}

class TextWidthCalculator {
  private dom: HTMLDivElement | null
  public constructor(style?: TextWidthCalculatorStyleProps) {
    this.dom = document.createElement('div')
    this.dom.style.display = 'inline-block'
    this.dom.style.fontSize = `${style?.fontSize || 12}px`
    this.dom.style.fontStyle = style?.fontStyle || 'normal'
    this.dom.style.fontWeight = style?.fontWeight || 'normal'
    this.dom.style.lineHeight = `${style?.lineHeight || 16}px`
    document.body.appendChild(this.dom)
  }
  public getTextWidth = (text: string): number => {
    if (this.dom && text) {
      this.dom.textContent = text
      return this?.dom?.clientWidth
    }
    return 0
  }
  public destroyDom = (): void => {
    if (this.dom) {
      document.body.removeChild(this.dom)
      this.dom = null
    }
  }
}

export default TextWidthCalculator
