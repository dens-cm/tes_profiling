/* eslint-disable no-unused-vars */
import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { Helmet } from 'react-helmet'

export default function Archives() {
    return (
        <Chakra.Box>
            <Helmet>
                <title>Archives - Tagongon Elementary School Profiling System</title>
                <meta name="description" content="Access and manage archived records in the Tagongon Elementary School Profiling System. Retrieve teacher profiles and other data as needed for administrative purposes." />
                <link rel="icon" type="image/svg+xml" href="/tes_logo.png" />
            </Helmet>
            archives
        </Chakra.Box>
    )
}
