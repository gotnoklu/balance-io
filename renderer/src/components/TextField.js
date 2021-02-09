import React from 'react'
import PropTypes from 'prop-types'
import MuiTextField from '@material-ui/core/TextField'

const TextField = ({ name, variant, type, placeholder, label, ...rest }) => {
	return (
		<MuiTextField
			name={name}
			variant={variant}
			type={type}
			label={label}
			placeholder={placeholder}
			margin='dense'
			fullWidth
			{...rest}
		/>
	)
}

TextField.propTypes = {
	name: PropTypes.string,
	variant: PropTypes.string,
	type: PropTypes.string,
	placeholder: PropTypes.string,
	label: PropTypes.string.isRequired,
	rest: PropTypes.object,
}

export default TextField
