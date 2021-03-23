# keyboard-avoidable

-   avoidable list forms for react native

## Basic Usage

```javascript
export default function App() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Avoidable containerStyle={{ flex: 1, width: '100%' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => {
                    return (
                        <TextInput
                            key={num}
                            style={{ width: '90%', alignSelf: 'center' }}
                            mode='outlined'
                            placeholder={'placeholder'}
                            label={String(num)}
                        />
                    )
                })}
            </Avoidable>
            <Text>Open up App.tsx to start working on your app!</Text>
            <StatusBar style='auto' />
        </ScrollView>
    )
}
```

## License

MIT
