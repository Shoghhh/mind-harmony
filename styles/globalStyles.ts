import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    // Direction
    row: {
        flexDirection: 'row',
    },
    column: {
        flexDirection: 'column',
    },

    // Justify Content
    justifyStart: {
        justifyContent: 'flex-start',
    },
    justifyCenter: {
        justifyContent: 'center',
    },
    justifyEnd: {
        justifyContent: 'flex-end',
    },
    justifySpaceBetween: {
        justifyContent: 'space-between',
    },
    justifySpaceAround: {
        justifyContent: 'space-around',
    },
    justifySpaceEvenly: {
        justifyContent: 'space-evenly',
    },

    // Align Items
    alignStart: {
        alignItems: 'flex-start',
    },
    alignCenter: {
        alignItems: 'center',
    },
    alignEnd: {
        alignItems: 'flex-end',
    },
    alignStretch: {
        alignItems: 'stretch',
    },

    // Combined Examples
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowSpaceAround: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    rowSpaceEvenly: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    rowStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    rowEnd: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    // Column Layouts
    columnCenter: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    columnSpaceBetween: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    columnSpaceAround: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    columnSpaceEvenly: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    columnStart: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    columnEnd: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
});

export default globalStyles;
