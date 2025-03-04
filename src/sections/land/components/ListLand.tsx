import type { Land } from "src/domains/dto/land";

import { Box, ListItem, ListItemButton } from "@mui/material";

import { RouterLink } from "src/routes/components";

import { useLand } from "src/stores/use-land";

import { Scrollbar } from "src/components/scrollbar";

const ListLand = ({ data }: { data: Land[] }) => {
  const { selectedLand, setSelectedLand } = useLand();
  return (
    <div>
      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column">
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {data.map((item, index) => {
              const isActived = selectedLand as number === index;

              return (
                <ListItem disableGutters disablePadding key={item.name} sx={{}}>
                  <ListItemButton
                    disableGutters
                    onClick={(event) => {
                      console.log("click", index);
                      setSelectedLand(index);
                    }}
                    sx={{
                      px: 2,
                      py: 2,
                      gap: 2,
                      height: "50px",
                      borderRadius: 0.75,
                      typography: 'body1',
                      fontWeight: 'fontWeightMedium',
                      color: 'var(--layout-nav-item-color)',
                      minHeight: 'var(--layout-nav-item-height)',
                      ...(isActived && {
                        fontWeight: 'fontWeightSemiBold',
                        bgcolor: 'var(--layout-nav-item-active-bg)',
                        color: 'var(--layout-nav-item-active-color)',
                        '&:hover': {
                          bgcolor: 'var(--layout-nav-item-hover-bg)',
                        },
                      }),
                    }}
                  >
                    <Box component="span" flexGrow={1}>
                      {item.name}
                    </Box>
                    <span>{item.area}m<sup className="p-0">2</sup></span>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>
    </div>
  );
}

export default ListLand;