#!/bin/bash
#
P_MOD_FOLDER="${PWD}";
P_DEV_FOLDER="${P_MOD_FOLDER}/ui-ng";
P_PUBLIC_FOLDER="${P_MOD_FOLDER}/ui";
#
#P_NG="${P_DEV_FOLDER}/node_modules/.bin/ng";
P_NG="ng";
#
# echo -e "\e[32mCleaning old built UI directory:\e[0m";
# rm -frv "${P_PUBLIC_FOLDER}/"* | awk '{print "\t" $0}';
# #
echo -e "\e[32mAccessing angular folder:\e[0m";
cd "${P_DEV_FOLDER}";
#
echo -e "\e[32mBuilding UI:\e[0m";
"${P_NG}" build --prod --output-path "${P_PUBLIC_FOLDER}" --delete-output-path | awk '{print "\t" $0}';
#
echo -e "\e[32mReturning to parent directory:\e[0m";
cd ..;
# #
# echo -e "\e[32mCopying built client:\e[0m";
# cp -frv "${P_DEV_FOLDER}/dist/"* "${P_PUBLIC_FOLDER}" | awk '{print "\t" $0}';
#
