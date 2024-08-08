import React, { useState, useEffect } from 'react';

export const useCheckboxFunctions = (tableData) => {
    const [selectAll, setSelectAll] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);

    // tableData가 변경될 때마다 checkedItems 초기화
    useEffect(() => {
        setCheckedItems(Array(tableData.length).fill(false));
    }, [tableData]);

    // 전체 선택 체크박스 클릭 시
    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setCheckedItems(Array(tableData.length).fill(newSelectAll));
    };

    // 개별 체크박스 클릭 시
    const handleCheckboxChange = (index) => {
        const newCheckedItems = [...checkedItems];
        newCheckedItems[index] = !checkedItems[index];
        setCheckedItems(newCheckedItems);

        // 모든 체크박스가 선택되었는지 확인
        const allChecked = newCheckedItems.every((item) => item === true);
        setSelectAll(allChecked);
    };

    return { selectAll, checkedItems, handleSelectAll, handleCheckboxChange };
};
