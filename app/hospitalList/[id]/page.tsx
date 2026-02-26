import React from 'react';

type PageProps = {
    params: {
        id: string;
    };
};

const Page = async ({ params }: PageProps) => {
    const { id } = params;
    return (
        <div>
            this is a hospital details page with hospital id as a parameter in the url {id}
        </div>
    );
}

export default Page;
