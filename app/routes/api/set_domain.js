import React from 'react';
import {commitSession} from "~/sessions";
import {redirect} from "@remix-run/node";
import {getUserSession} from "~/utils/session.server";

export const action = async ({ request }) => {
    const formData = await request.formData();

    const domain = formData.get('domain')
    const redirectTo = formData.get('redirectTo')
    const session = await getUserSession(request);

    session.set("domain", domain);

    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
};

const SetDomain = () => {
    return <></>;
};

export default SetDomain;