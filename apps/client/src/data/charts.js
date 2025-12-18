/** @format */

import { ThemeColors } from '../helpers/ThemeColors';

const colors = ThemeColors();

const doughnutChartData = {
    labels: ['Cakes', 'Cupcakes', 'Desserts'],
    datasets: [
        {
            label: '',
            borderColor: [colors.themeColor3, colors.themeColor2, colors.themeColor1],
            backgroundColor: [colors.themeColor3_10, colors.themeColor2_10, colors.themeColor1_10],
            borderWidth: 2,
            data: [15, 25, 20],
        },
    ],
};

export default doughnutChartData;
