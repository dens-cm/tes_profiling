/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React from 'react'
import dayjs from 'dayjs'
import * as Chakra from '@chakra-ui/react'
import { HiTrash, HiArchiveBoxArrowDown } from 'react-icons/hi2'
import { Helmet } from 'react-helmet'
import { TiFolderOpen } from "react-icons/ti"
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { MaterialReactTable } from 'material-react-table'
import { collection, onSnapshot, query, where, updateDoc, doc } from 'firebase/firestore'
import { firestoreDB } from '../../config/FirebaseConfig'
import ConfimUserDelete from '../../components/modal/ConfimUserDelete'
import Toast from '../../components/Toast'

export default function Archives() {

    const [users, setUsers] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const { isOpen, onOpen, onClose } = Chakra.useDisclosure()
    const [selectedUser, setSelectedUser] = React.useState(null)
    const showToast = Toast()

    React.useEffect(() => {
        const usersQuery = query(
            collection(firestoreDB, 'users'),
            where('status', '==', 'archive')
        )

        setLoading(true)

        const unsubscribe = onSnapshot(
            usersQuery,
            (snapshot) => {
                const userList = snapshot.docs
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    .filter((user) => user.userType !== 'admin')
                setUsers(userList)
                setLoading(false)
            },
            (error) => {
                console.error('Error fetching users:', error)
                setUsers([])
                setLoading(false)
            }
        )

        return () => unsubscribe()
    }, [])

    const columns = React.useMemo(
        () => [
            {
                accessorKey: 'index',
                header: 'No.',
                size: 5,
                Cell: ({ row }) => row.index + 1
            },
            {
                accessorKey: 'firstName',
                header: 'First Name'
            },
            {
                accessorKey: 'middleName',
                header: 'Middle Name',
                Cell: ({ cell }) => (
                    <Chakra.Text color={cell.getValue() ? 'black' : 'gray.400'}>
                        {cell.getValue() || 'N/A'}
                    </Chakra.Text>
                )
            },
            {
                accessorKey: 'lastName',
                header: 'Last Name'
            },
            {
                accessorKey: 'extensionName',
                header: 'Extension Name',
                size: 5,
                Cell: ({ cell }) => (
                    <Chakra.Text color={cell.getValue() ? 'black' : 'gray.400'}>
                        {cell.getValue() || 'N/A'}
                    </Chakra.Text>
                )
            },
            {
                accessorKey: 'gender',
                header: 'Gender',
                size: 5
            },
            {
                accessorKey: 'contactNumber',
                header: 'Contact',
                size: 5
            },
            {
                accessorKey: 'address',
                header: 'Address',
            },
            {
                accessorKey: 'age',
                header: 'Age',
            },
            {
                accessorKey: 'birthdate',
                header: 'Birthdate',
            },
            {
                accessorKey: 'birthplace',
                header: 'Birthplace',
            },
            {
                accessorKey: 'civilStatus',
                header: 'Civil Status',
            },
            {
                accessorKey: 'citizenship',
                header: 'Citizenship',
            },
            {
                accessorKey: 'emailAddress',
                header: 'Email Address',
            },
            {
                accessorKey: 'ehrisNo',
                header: 'Ehris No.',
            },
            {
                accessorKey: 'employeeId',
                header: 'Employee ID',
            },
            {
                accessorKey: 'position',
                header: 'Position',
            },
            {
                accessorKey: 'active',
                header: 'Active',
            },
            {
                accessorKey: 'applicationStatus',
                header: 'Application Status',
            },
            {
                accessorKey: 'statusOfEmployment',
                header: 'Status of Employment',
            },
            {
                accessorKey: 'itemNumber',
                header: 'Item Number',
            },
            {
                accessorKey: 'oldItemNumber',
                header: 'Old Item Number',
            },
            {
                accessorKey: 'originalDateAsPermanent',
                header: 'Original Date as Permanent',
            },
            {
                accessorKey: 'dateOfOriginalAppointment',
                header: 'Date of Original Appointment',
            },
            {
                accessorKey: 'dateOfLastPromotion',
                header: 'Date of Last Promotion',
            },
            {
                accessorKey: 'remarksStatus',
                header: 'Remarks Status',
            },
            {
                accessorKey: 'tinNumber',
                header: 'TIN Number',
            },
            {
                accessorKey: 'sssNumber',
                header: 'SSS Number',
            },
            {
                accessorKey: 'philhealth',
                header: 'PhilHealth Number',
            },
            {
                accessorKey: 'gsisNumber',
                header: 'GSIS Number',
            },
            {
                accessorKey: 'pagibigNumber',
                header: 'Pag-ibig Number',
            },
            {
                accessorKey: 'prcNumber',
                header: 'PRC Number',
            },
            {
                accessorKey: 'prcExpirationDate',
                header: 'PRC Number Expiration Date',
            },
            {
                accessorKey: 'adviser',
                header: 'Adviser',
            },
            {
                accessorKey: 'csEligibility',
                header: 'CS Eligibility',
                Cell: ({ row }) => {
                    const csEligibility = row.original.csEligibility
                    const otherCsEligibility = row.original.otherCsEligibility
                    return csEligibility === "Others" ? otherCsEligibility : csEligibility
                },
            },
            {
                accessorKey: 'educationalAttainment',
                header: 'Educational Attainment',
            },
            {
                accessorKey: 'plantillaItemNo',
                header: 'Plantilla Item No',
            },
            {
                accessorKey: 'firstDayOfService',
                header: 'First day of Service of Current Station',
            },
            {
                accessorKey: 'teachingExperience',
                header: 'Teaching Experience',
                Cell: ({ row }) => {
                    const firstDay = dayjs(row.original.firstDayOfService)
                    const now = dayjs()

                    if (!firstDay.isValid()) {
                        return 'N/A'
                    }

                    const years = now.diff(firstDay, 'year')
                    const months = now.diff(firstDay.add(years, 'year'), 'month')
                    const days = now.diff(firstDay.add(years, 'year').add(months, 'month'), 'day')

                    const yearText = years === 1 ? 'year' : 'years'
                    const monthText = months === 1 ? 'month' : 'months'
                    const dayText = days === 1 ? 'day' : 'days'

                    return `${years} ${yearText}, ${months} ${monthText}, and ${days} ${dayText}`
                },
            },
            {
                accessorKey: 'basicSalary',
                header: 'Basic Salary',
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                Cell: ({ row }) => (
                    <Chakra.Box>
                        <Chakra.Button onClick={onOpen} w='5vw' mr='5%' p='2%' fontSize='.7vw' bg='red' color='white' borderRadius='0' leftIcon={<HiTrash />} _hover={{ bg: 'gray.100', border: '.1vw solid red', color: 'red', transition: '.2s' }} transition='.2s' border='.1vw solid red'>Delete</Chakra.Button>
                        <Chakra.Button onClick={() => handleRestoreUser(row.original.id)} w='5vw' p='2%' fontSize='.7vw' bg='darkBlue' color='white' borderRadius='0' leftIcon={<HiArchiveBoxArrowDown />} _hover={{ bg: 'gray.100', border: '.1vw solid darkBlue', color: 'darkBlue', transition: '.2s' }} transition='.2s' border='.1vw solid darkBlue'>Restore</Chakra.Button>
                    </Chakra.Box>
                ),
            }
        ],
        []
    )

    const theme = createTheme({
        shadows: ["none"]
    })

    const handleRestoreUser = async (userId) => {
        const userDoc = doc(firestoreDB, 'users', userId)
        setLoading(true)

        try {
            await updateDoc(userDoc, { status: 'active' })
        }

        catch (error) {
            showToast({ title: 'Error', description: `${error}`, status: 'error', variant: 'solid', position: 'top' })
            setLoading(false)
        }

        finally {
            setLoading(false)
        }
    }

    return (
        <Chakra.Box w='100%' h='100%' display='flex' flexDirection='column' p='1%' bg='white' overflow='auto'>
            <Helmet>
                <title>Archives - Tagongon Elementary School Profiling System</title>
                <meta name="description" content="Access and manage archived records in the Tagongon Elementary School Profiling System. Retrieve teacher profiles and other data as needed for administrative purposes." />
                <link rel="icon" type="image/svg+xml" href="/tes_logo.png" />
            </Helmet>
            <Chakra.Box w='100%' mb='1%' display='flex' alignItems='center' justifyContent='space-between'>
                <Chakra.Text w='100%' fontSize='.9vw' fontWeight='bold' color='gray.600' display='flex' alignItems='center'> <Chakra.Text mr='.5%'><TiFolderOpen /></Chakra.Text> Tagongon Elementary School Archived Teachers</Chakra.Text>
                {loading && (
                    <Chakra.Box display='flex' alignItems='center'>
                        <Chakra.Spinner w='1vw' h='1vw' mr='.5vw' color='gray.500'/>
                        <Chakra.Text fontSize='.9vw' fontWeight='700' color='gray.500'>Loading... </Chakra.Text>
                    </Chakra.Box>
                )}
            </Chakra.Box>
            <hr />
            <Chakra.Box w='100%' h='100%' display='flex'>
                <Chakra.Box w='100%' h='100%'>
                    <ThemeProvider theme={theme}>
                        <MaterialReactTable
                            columns={columns}
                            data={users}
                            muiTableHeadCellProps={{ sx: { fontSize: '.8vw', color: 'black' } }}
                            muiTableBodyCellProps={{ sx: { fontSize: '.8vw', textTransform: 'capitalize' } }}
                            enablePagination={true}
                            enableBottomToolbar={true}
                            enableRowActions={false}
                            initialState={{
                                density: 'compact', pagination: { pageSize: '10' },
                                columnVisibility: {
                                    address: false,
                                    emailAddress: false,
                                    age: false,
                                    birthdate: false,
                                    birthplace: false,
                                    civilStatus: false,
                                    citizenship: false,
                                    ehrisNo: false,
                                    employeeId: false,
                                    position: false,
                                    active: false,
                                    applicationStatus: false,
                                    statusOfEmployment: false,
                                    itemNumber: false,
                                    oldItemNumber: false,
                                    originalDateAsPermanent: false,
                                    dateOfOriginalAppointment: false,
                                    dateOfLastPromotion: false,
                                    remarksStatus: false,
                                    tinNumber: false,
                                    sssNumber: false,
                                    philhealth: false,
                                    gsisNumber: false,
                                    pagibigNumber: false,
                                    prcNumber: false,
                                    prcExpirationDate: false,
                                    adviser: false,
                                    csEligibility: false,
                                    educationalAttainment: false,
                                    plantillaItemNo: false,
                                    firstDayOfService: false,
                                    teachingExperience: false,
                                    basicSalary: false
                                }
                            }}
                            muiTableBodyRowProps={({ row }) => ({
                                sx: { background: 'blue', height: '2vw' },
                                onClick: () => {
                                    setSelectedUser(row.original)
                                }
                            })}
                        />
                    </ThemeProvider>
                </Chakra.Box>
            </Chakra.Box>

            <ConfimUserDelete isOpen={isOpen} onClose={onClose} user={selectedUser}/>
        </Chakra.Box>
    )
}
