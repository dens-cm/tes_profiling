import * as XLSX from 'xlsx'

const capitalizeFirstLetter = (text) => {
    if (!text || typeof text !== 'string') return 'N/A'
    return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export const convertToCSV = (data, columns) => {
    const headers = columns.map(col => col.header).join(',') + '\n'
    const rows = data
        .map(row =>
            columns
                .map(col =>
                    col.accessorKey === 'emailAddress'
                        ? row[col.accessorKey]
                        : capitalizeFirstLetter(row[col.accessorKey] || '')
                )
                .join(',')
        )
        .join('\n')
    return headers + rows
}

export const saveCSV = (data, columns, filename) => {
    const excelData = data.map(row =>
        columns.reduce((acc, col) => {
            const value = row[col.accessorKey] || ''
            acc[col.header] =
                col.accessorKey === 'emailAddress'
                    ? value
                    : capitalizeFirstLetter(value)
            return acc
        }, {})
    )

    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    const columnWidths = columns.map(col => ({
        wch: Math.max(
            col.header.length,
            ...excelData.map(row => (row[col.header]?.toString().length || 0))
        )
    }))

    worksheet['!cols'] = columnWidths

    XLSX.writeFile(workbook, `${filename}.xlsx`)
}
