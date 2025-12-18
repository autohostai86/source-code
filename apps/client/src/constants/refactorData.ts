/** @format */

// using these predefined key for iterating over the data and sequencing complexity O(n)
const preDefinedKeys = [
    'name',
    'address',
    'phone_number',
    'email_id',
    'gender',
    'date_of_birth',
    'nationality',
    'personal_information',
    'work_experience',
    'education',
    'language',
    'table_1',
    'other_skills',
    'table_2',
    'driving_license',
    'fiscal_code',
];

export function REFACTORDATA(processedDatas) {
    // console.log(processedDatas);

    let refactoredData = [];

    // eslint-disable-next-line array-callback-return
    const newProcessedData = preDefinedKeys.map((key) => {
        let newdata = processedDatas.filter((data) => data.label.includes(key));
        // console.log(newdata);

        if (key === 'other_skills' || key === 'work_experience' || key === 'other_skills') {
            // eslint-disable-next-line no-param-reassign
            key = `${key}_1`;
        }
        if (newdata.length < 1) {
            newdata = [{ label: key, data: '---' }];
        }
        refactoredData = [...refactoredData, ...newdata];
        // return newdata;
    });
    // console.log(refactoredData);

    return refactoredData;
    // UIState.
}

export default {};
