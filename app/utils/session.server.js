import {
    redirect,
} from "@remix-run/node";
import {$api, $server, API_URL} from "~/lib/api";
import {commitSession, getSession} from "~/sessions";

export async function login(code, request) {
    return fetch(API_URL + '/oauth/token', {
        method: 'post',
        body: JSON.stringify({
            client_id: process.env.OAUTH_CLIENT_ID,
            client_secret: process.env.OAUTH_CLIENT_SECRET,
            redirect_uri: process.env.OAUTH_CLIENT_REDIRECT_URI,
            grant_type: 'authorization_code',
            code
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((rs) => {
        return rs.json()
    }).then((data) => {
        return fetch(API_URL + '/api/user', {
            headers: {
                Authorization: "Bearer " + data.access_token
            }
        }).then((rs_) => {
            return rs_.json();
        }).then(user => {
            return Promise.resolve({
                user,
                access_token: data.access_token,
                refresh_token: data.refresh_token,
            });
        })
    }).catch((err) => {
        console.log(err)
        return null;
    })
}

function getUserSession(request) {
    return getSession(request.headers.get("Cookie"));
}

export async function getUserId(request) {
    const session = await getUserSession(request);
    const user = session.get("user");
    if (!user) return null;
    return user.id;
}

export async function requireUser(
    request,
    redirectTo = new URL(request.url).pathname
) {
    const session = await getUserSession(request);
    const user = session.get("user");

    if (!user) {
        const searchParams = new URLSearchParams([
            ["redirectTo", redirectTo],
        ]);
        throw redirect(`/login?${searchParams}`);
    }
    return user;
}

export async function createUserSession(
    data,
    redirectTo
) {
    const session = await getSession();

    session.set("user", data.user);
    session.set("access_token", data.access_token);
    session.set("refresh_token", data.refresh_token);

    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}