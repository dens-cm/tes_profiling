/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from 'react'
import dayjs from 'dayjs'
import * as Chakra from '@chakra-ui/react'
import * as ChakraIcon from '@chakra-ui/icons'
import { Helmet } from 'react-helmet'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { MaterialReactTable } from 'material-react-table'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { firestoreDB } from '../../config/FirebaseConfig'
import { useAuth } from '../../config/Authentication'
import ViewTeacherData from '../../components/modal/ViewTeacherData'
import { TiExport, TiFolderOpen } from "react-icons/ti"

export default function Teachers() {

    const { logout } = useAuth()
    const [users, setUsers] = React.useState([])
    const [selectedUser, setSelectedUser] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [teachingExperience, setTeachingExperience] = React.useState('')
    const { isOpen: isOpenUserData, onOpen: onOpenUserData, onClose: onCloseUserData } = Chakra.useDisclosure()

    React.useEffect(() => {
        const usersQuery = query(
            collection(firestoreDB, 'users'),
            where('status', '!=', 'archive')
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
                logout()
            }
        )

        return () => unsubscribe()
    }, [logout])

    React.useEffect(() => {
        const calculateExperience = () => {
            if (users?.firstDayOfService) {
                const firstDay = dayjs(users.firstDayOfService)
                const now = dayjs()

                const years = now.diff(firstDay, 'year')
                const months = now.diff(firstDay.add(years, 'year'), 'month')
                const days = now.diff(firstDay.add(years, 'year').add(months, 'month'), 'day')

                const yearText = years === 1 ? 'year' : 'years'
                const monthText = months === 1 ? 'month' : 'months'
                const dayText = days === 1 ? 'day' : 'days'

                const experienceText = `${years} ${yearText}, ${months} ${monthText} and ${days} ${dayText}`
                setTeachingExperience(experienceText)
            }
        }

        calculateExperience()
    }, [users])

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
                header: 'CS Eligibility'
            },
            {
                accessorKey: 'educationalAttainment',
                header: 'Educational Attainment',
            },
            {
                accessorKey: 'plantillaNo',
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
                    return teachingExperience ? `${teachingExperience} years` : 'N/A'
                }
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
                    <Chakra.Button onClick={() => { setSelectedUser(row.original), onOpenUserData() }} w='4vw' p='2%' fontSize='.7vw' mr='5%' bg='blue' color='white' borderRadius='0' leftIcon={<ChakraIcon.ViewIcon />} _hover={{ bg: 'gray.100', border: '.1vw solid blue', color: 'blue', transition: '.2s' }} transition='.2s' border='.1vw solid blue'>View</Chakra.Button>
                    {/* <Chakra.Button onClick={() => handleArchiveUser(row.original.id)} w='5vw' p='2%' fontSize='.7vw' bg='red' color='white' borderRadius='.5vw' leftIcon={<ReactIcons.HiMiniArchiveBox />} _hover={{ bg: 'gray.100', border: '.1vw solid red', color: 'red', transition: '.2s' }} transition='.2s' border='.1vw solid red'>Archive</Chakra.Button> */}
                  </Chakra.Box>
                ),
              }
        ],
        []
    )

    const theme = createTheme({
        shadows: ["none"]
    })

    return (
        <Chakra.Box w='100%' h='100%' display='flex' flexDirection='column' p='1%' bg='white' overflow='auto'>
            <Helmet>
                <title>List of Teachers - Tagongon Elementary School Profiling System</title>
                <meta name="description" content="View and manage the list of teachers in the Tagongon Elementary School Profiling System, ensuring accurate and up-to-date records for effective administration." />
                <link rel="icon" type="image/svg+xml" href="/tes_logo.png" />
            </Helmet>
            <Chakra.Box w='100%' mb='1%' display='flex' alignItems='center' justifyContent='space-between'>
                <Chakra.Text w='100%' fontSize='.9vw' fontWeight='bold' color='gray.600' display='flex' alignItems='center'> <Chakra.Text mr='.5%'><TiFolderOpen /></Chakra.Text> Tagongon Elementary School Teachers</Chakra.Text>
                <Chakra.Button h='1.7vw' fontSize='.7vw' colorScheme='teal' leftIcon={<TiExport size='.9vw' />} isLoading={loading} borderRadius='0'>Export data</Chakra.Button>
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
                            muiTableBodyRowProps={{ sx: { background: 'blue', height: '2vw' } }}
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
                                    plantillaNo: false,
                                    firstDayOfService: false,
                                    teachingExperience: false,
                                    basicSalary: false
                                }
                            }}
                        />
                    </ThemeProvider>
                </Chakra.Box>
            </Chakra.Box>

            <ViewTeacherData isOpen={isOpenUserData} onClose={onCloseUserData} user={selectedUser}/>
        </Chakra.Box>
    )
}
