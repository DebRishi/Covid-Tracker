import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import './InfoBox.css'

function InfoBox({ title, color, cases, total, active, ...props }) {
    return (
        <Card className={`info_box ${active && "is_selected"}`} onClick={props.onClick}>
            <CardContent>
                <Typography className="info_box_title" color="textSecondary">
                    {title}
                </Typography>
                <h2 className={`info_box_cases ${'is-' + color}`} >{cases}</h2>
                <Typography className="info_box_total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card >
    )
}

export default InfoBox;
