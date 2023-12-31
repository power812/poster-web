// import { mapValues, without } from 'lodash-es'
// import { reactive } from 'vue'
export interface CommonComponentTypeProps {
    // actions
    actionType: string
    url: string
    // size
    height: string
    width: string
    paddingLeft: string
    paddingRight: string
    paddingTop: string
    paddingBottom: string
    // border type
    borderStyle: string
    borderColor: string
    borderWidth: string
    borderRadius: string
    // shadow and opacity
    boxShadow: string
    opacity: string
    // position and x,y
    position: string
    left: string
    top: string
    right: string
    src: string
    backgroundImage: string
    backgroundRepeat: string
    backgroundSize: string
}

export interface TextComponentTypeProps extends CommonComponentTypeProps {
    [x: string]: any
    text: string
    fontSize: string
    fontFamily: string
    fontWeight: string
    fontStyle: string
    textDecoration: string
    lineHeight: string
    textAlign: string
    color: string
    backgroundColor: string
    tag: string
    position: string
    left: string
    top: string
    right: string
    src: string
    backgroundImage: string
    backgroundRepeat: string
    backgroundSize: string
}
export const commonDefaultProps: CommonComponentTypeProps = {
    // actions
    actionType: '',
    url: '',
    // size
    height: '',
    width: '100%',
    paddingLeft: '0px',
    paddingRight: '0px',
    paddingTop: '0px',
    paddingBottom: '0px',
    // border type
    borderStyle: 'none',
    borderColor: '#000000',
    borderWidth: '0',
    borderRadius: '0',
    // shadow and opacity
    boxShadow: '0 0 0 #000000',
    opacity: '1',
    src: '',
    position: 'absolute',
    left: '0',
    top: '0',
    right: '0',
    backgroundImage: '',
    backgroundRepeat: '',
    backgroundSize: '',
}
export const textDefaultProps: TextComponentTypeProps = {
    // basic props - font styles
    text: '正文内容',
    fontSize: '14px',
    fontFamily: '',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    lineHeight: '1',
    textAlign: 'left',
    color: '#000000',
    backgroundColor: '',
    tag: 'div',

    ...commonDefaultProps,
}
