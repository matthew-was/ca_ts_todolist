## Todo app to demonstrate clean architecture

This repository is the code that was shown at the Reading Google Development Group meetup on 18th April 2019 at 9 Greyfriars Road in Reading. The talk will be available soon and the link will provided here. The slides from this talk (with limited view of the code) are included here as gdg_180419.pdf.

The code in this repository is split into three branches. The main branch is `full_ts` and this represents the full typescript app. The seond branch is `transition1`, this branch represents removing the state into MobX. The third branch, `transition2`, represents the closest to the Clean Architecture and has UI, Presenter and Gateway separating the concerns of the three modules into three distinct files.

All branches of the code should be working and can be run using `yarn start`. To app relies on a simple crud backend service which I have created at [https://github.com/matthew-was/lr-ca-ts-todo-backend](https://github.com/matthew-was/lr-ca-ts-todo-backend). The backend does not follow the Clean Architecture and is a simple CRUD placeholder.

If you have any questions or comments please feel free to contact me at [matt@logicroom.co](mailto:matt@logicroom.co)