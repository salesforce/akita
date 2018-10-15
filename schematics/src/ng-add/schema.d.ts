export interface Schema {
    /**
     * Skip adding dependencies and installing them
     */
    skipPackageJson?: boolean;
    /**
     * Add the the router store
     */
    withRouter?: boolean;
    project?: any;
}
