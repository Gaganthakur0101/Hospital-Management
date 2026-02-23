import React from 'react';

const Page = async ({ params }: any) => {
    const {id} =  await params;
    return (
        <div>
            this is a page which take parameter from query {id}
        </div>
    );
}

export default Page;
