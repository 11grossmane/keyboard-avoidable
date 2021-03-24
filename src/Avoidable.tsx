import * as React from 'react'
import {
    Animated,
    Dimensions,
    Keyboard,
    ScrollView,
    StyleProp,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ViewStyle
} from 'react-native'

const { height: screenHeight, width: screenWidth } = Dimensions.get('screen')

export type AvoidableProps = {
    containerStyle?: ViewStyle
    overlayStyle?: ViewStyle
    focusedItemStyle?: ViewStyle
    header?: JSX.Element
}

let contentOffset = 0

export const Avoidable: React.FC<AvoidableProps> = ({
    children,
    containerStyle,
    overlayStyle,
    focusedItemStyle,
    header
}) => {
    const [keyboardHeight, setKeyboardHeight] = React.useState(0)
    const [touchable, setTouchable] = React.useState('')
    let [animated, setAnimated] = React.useState(new Animated.Value(0))
    const [layoutMap, setLayoutMap] = React.useState<{
        [index: string]: { y: number }
    }>({})

    React.useEffect(() => {
        let sub1 = Keyboard.addListener('keyboardWillShow', (e) => {
            console.log('coords', e.startCoordinates.height)
            setKeyboardHeight(e.endCoordinates.height)
        })
        let sub2 = Keyboard.addListener('keyboardWillHide', () => {
            setKeyboardHeight(0)
        })
        return () => {
            sub1.remove()
            sub2.remove()
        }
    }, [])

    const move = (str: string) => {
        let itemHeight = layoutMap[str].y
        let an = new Animated.Value((itemHeight / screenHeight) * 2.5)
        Animated.timing(an, {
            duration: 400,
            toValue: 1,
            useNativeDriver: true
        }).start()
        return an
    }

    const getStyle = (str: string): StyleProp<any> => {
        if (keyboardHeight && touchable === str) {
            console.log('content', screenHeight - contentOffset)
            return {
                zIndex: 2,
                position: 'absolute',
                width: screenWidth * 0.96,
                left: screenWidth * 0.02,

                top: contentOffset + (screenHeight - keyboardHeight) - 165,
                transform: [
                    {
                        translateY: animated.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-180, 0]
                        })
                    }
                ],
                ...focusedItemStyle
            }
        }
        return {}
    }
    return (
        <ScrollView
            overScrollMode='always'
            scrollToOverflowEnabled={false}
            contentContainerStyle={{
                padding: 10,
                minHeight: '100%',
                paddingBottom: 80,
                ...containerStyle
            }}
            style={{ flex: 1 }}
            scrollEventThrottle={8}
            onScroll={(e) => {
                contentOffset = e.nativeEvent.contentOffset.y
            }}
        >
            {header && header}
            {!!keyboardHeight && !!touchable && (
                <View
                    style={{
                        zIndex: 1,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: 'rgba(0,0,0,1)',
                        opacity: 0.5,
                        minHeight: 100000, //anything larger than scrollview
                        width: screenWidth,
                        ...overlayStyle
                    }}
                >
                    <TouchableOpacity style={{ height: '100%' }} onPress={Keyboard.dismiss} />
                </View>
            )}

            {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return false
                if (!child?.key) return <View>{child}</View>
                let keyStr = child.key.toString()
                return (
                    <TouchableWithoutFeedback
                        onFocus={() => {
                            setTouchable(keyStr)
                            let an = move(keyStr)
                            setAnimated(an)
                        }}
                    >
                        <Animated.View
                            onLayout={(e) => {
                                console.log(e.nativeEvent.layout.y, e.nativeEvent.layout.height)
                                if (!layoutMap[keyStr])
                                    setLayoutMap({
                                        ...layoutMap,
                                        [keyStr]: { y: e.nativeEvent.layout.y }
                                    })
                            }}
                            style={[getStyle(keyStr)]}
                        >
                            {child}
                        </Animated.View>
                    </TouchableWithoutFeedback>
                )
            })}
        </ScrollView>
    )
}