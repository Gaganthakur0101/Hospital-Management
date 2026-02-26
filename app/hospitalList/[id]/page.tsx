import React from 'react';

const Page = async({params}: any) => {
    const {id} =  await params;
    return (
        <div>
            this is a hospital details page with hospital id as a parameter in the url {id}
        </div>
    );
}

export default Page;
