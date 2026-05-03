

const Authrization = (...permissions) => {
  return async (req, res, next) => {
    const user = await req.user?.populate({
      path: "roles",
      populate: "permissions",
    });

    const permissionsNames = user.roles
      .map((role) => role.permissions)
      .flat()
      .map((permission) => permission.name);

    
    const hasPermission = permissionsNames.some((permission) => permissions.includes(permission));
    
    if (!hasPermission) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    next();
  };
};

export default Authrization;
