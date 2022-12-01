import {deletePosition} from "~/models/position.server";
import {redirect} from "@remix-run/node";

export const action = async ({ request }) => {
    const formData = await request.formData();

    await deletePosition(formData.get('id'))

    return redirect('/storage');
};