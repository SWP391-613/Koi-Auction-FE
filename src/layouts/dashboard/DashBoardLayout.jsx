import React from 'react';
import { Box, List, ListItem, ListItemText } from '@mui/material';

const DashboardLayout = ({ children }) => {
    return (
        <Box display="flex" height="100vh">
            <Box component="nav" sx={{ width: '240px', backgroundColor: '#f4f4f4', p: 2 }}>
                <List>
                    <ListItem button>
                        <ListItemText primary="Product" />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Koi" />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="User" />
                    </ListItem>
                    <ListItem button>
                        <ListItemText primary="Employee" />
                    </ListItem>
                </List>
            </Box>
            <Box component="main" sx={{ flex: 1, p: 2 }}>
                {children} {/* Render child components here */}
            </Box>
        </Box>
    );
};

export default DashboardLayout;