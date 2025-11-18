import { Formik, Field, Form } from 'formik'

const LoginPage = () => {
    return ( <div>
        <h1>Authorization</h1>
        <Formik
            initialValues={{login: '', password: ''}}
            onSubmit={(values) => {
                console.log('The form has been submitted', values)
            }}
        >
        {() => (
            <Form>
                <div>
                    <label htmlFor='login'>User name:</label>
                    <Field
                        id="login"
                        name="login" 
                        type="text"
                        placeholder="Введите логин"
                    />
                </div>
                <div>
                    <label htmlFor='pasword'>Password:</label>
                    <Field
                        id="password"
                        name="password" 
                        type="password"
                        placeholder="Введите пароль"
                    />
                </div>
            </Form>
        )}
    </Formik>
    </div>)
}

export default LoginPage