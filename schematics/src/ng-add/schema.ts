export interface Schema {
  /**
   * Skip adding dependencies and installing them
   */
  skipPackageJson?: boolean;

  /**
   * Add the the router store
   */
  withRouter?: boolean;
  router?: boolean;
  /**
   * Add the the devtools
   */
  devtools?: boolean;
  /**
   * Add the Http entity service
   */
  httpEntityService?: boolean;
  /**
   * Add the Firebase entity service
   */
  firebaseEntityService?: boolean;

  project?: any;
}
