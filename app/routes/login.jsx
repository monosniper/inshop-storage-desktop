import globalStyles from "~/styles/global.css";
import styles from "~/styles/pages/login.css";
import OAuth2Login from "react-simple-oauth2-login";
import {json} from "@remix-run/node";
import {useFetcher, useLoaderData, useSearchParams, useSubmit, useTransition} from "@remix-run/react";
import {createUserSession, login} from "~/utils/session.server";

import logoImg from '~/assets/img/logo.svg'
import {useEffect, useRef, useState} from "react";
import axios from "axios";

export function links() {
    return [
        { rel: "stylesheet", href: globalStyles },
        { rel: "stylesheet", href: styles },
    ];
}

const badRequest = (data) => json(data, { status: 400 });

export const action = async ({ request }) => {
    // const body = await request.json()

    const formData = await request.formData();
    const code = formData.get('code')
    const redirectTo = formData.get('redirectTo')

    const data = await login(code, request)

    if (!data) {
        return badRequest({
            formError: `Произошла какая-то ошибка.`,
        });
    }

    return createUserSession(data, redirectTo);
};

export const loader = async () => {
    return json({
        API_ORIGIN_URL: process.env.API_ORIGIN_URL,
        OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID,
        OAUTH_CLIENT_REDIRECT_URI: process.env.OAUTH_CLIENT_REDIRECT_URI,
    });
};

const Login = () => {
    const fetcher = useFetcher();
    // const submit = useSubmit();
    const form = useRef();
    const [code, setCode] = useState();
    const loaderData = useLoaderData()
    const [searchParams] = useSearchParams();
    // const transition = useTransition()

    const onSuccess = (rs) => {
        // axios.post('#', {
        //     code: rs.code,
        //     redirectTo: searchParams.get("redirectTo") ?? undefined
        // }).then(rs => {
        //     console.log(rs)
        // })
        fetcher.submit({
            code: rs.code,
            redirectTo: searchParams.get("redirectTo") ?? undefined
        }, {method:'post'})
        // submit(form.current, { replace: true });
        // form.current.submit()
    }

    return (
        <div className={"wrapper"}>
            <fetcher.Form method="post" />
            {/*<form action="login" method={'post'} ref={form}>*/}
            {/*    <input type="hidden" name={'code'} value={code}/>*/}
            {/*    <input type="hidden" name={'redirectTo'} value={searchParams.get("redirectTo") ?? undefined}/>*/}
            {/*    /!*<button>sads</button>*!/*/}
            {/*</form>*/}
            <div className="big-logo">
                <img src={logoImg} />
            </div>
            <OAuth2Login
                authorizationUrl={loaderData.API_ORIGIN_URL + "/oauth/authorize"}
                responseType="code"
                clientId={loaderData.OAUTH_CLIENT_ID}
                redirectUri={loaderData.OAUTH_CLIENT_REDIRECT_URI}
                onSuccess={onSuccess}
                // isCrossOrigin={true}
                onFailure={(rs) => console.error(rs)}
                state={''}
                render={({onClick}) => <button className={"sign-btn"} onClick={onClick}>
                    Авторизация
                    {/*{transition.state === "idle" ? 'Авторизация' : 'Загрузка...'}*/}
                </button>}
            />
        </div>
    );
}

export default Login