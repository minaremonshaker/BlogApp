import Permission from "../models/Permission.js";


const PermissionSeeder = async () => {
    try {

        await Permission.deleteMany({});
        const permissions = [
            { name: "create_user" },
            { name: "update_user" },
            { name: "delete_user" },
            { name: "create_post" },
            { name: "update_post" },
            { name: "delete_post" },
        ];

        await Permission.insertMany(permissions);

        console.log("Permissions to be created");
    } catch (error) {
        console.error("Error in PermissionSeeder:", error);
    }
};

export default PermissionSeeder;