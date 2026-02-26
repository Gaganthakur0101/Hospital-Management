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
            this is a page which take parameter from query {id}
        </div>
    );
}

export default Page;
