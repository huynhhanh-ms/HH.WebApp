import type { Land } from "src/domains/dto/land";

import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Box, ListItem, IconButton, ListItemButton } from "@mui/material";

import { useLand } from "src/stores/use-land";
import { LandApi } from "src/services/api/land.api";
import { ApiQueryKey } from "src/services/api-query-key";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";

import DeleteDialog from "src/sections/tank/delete-dialog";

interface ListLandProps {
  data : Land[];
  onClick: (index: number) => void;
}

const ListLand = ({ data, onClick }: ListLandProps) => {
  const { selectedLand, setSelectedLand, setIsCreateLand} = useLand();
  const queryClient = useQueryClient();

  const [deletedItem, setDeletedItem] = useState<string | null>(null);

  const { mutateAsync: deleteLandApi } = useMutation({
    mutationFn: LandApi.delete,
    onSuccess: () => {
      setSelectedLand(null);
      enqueueSnackbar("Xóa thành công", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.land] });
      setIsCreateLand(false);
    }
  });

  return (
    <div className="h-10">
      <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column"
        sx={{
          maxHeight: "300px", // Chiều cao tối đa của danh sách
          overflowY: "auto", // Bật thanh cuộn khi nội dung vượt quá
        }}
      >
        <Scrollbar fillContent>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {data.map((item, index) => {
              const isActived = selectedLand as number === index;

              return (
                <ListItem disableGutters disablePadding key={index} sx={{}}>
                  <ListItemButton
                    disableGutters
                    onClick={(event) => {
                      setSelectedLand(index);
                      onClick(index);
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

                    <IconButton size="small" sx={{ p: 0.5 }} onClick={(e) => {
                      e.stopPropagation();
                      return setDeletedItem(item.id);
                    }}>
                      <Iconify icon="tabler:trash-filled" color="red" />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Scrollbar>

        <DeleteDialog open={!!deletedItem} onClose={() => setDeletedItem(null)} onConfirm={async () => {
          if (deletedItem) {
            await deleteLandApi(deletedItem);
          }
        }} />
      </Box>
    </div>
  );
}

export default ListLand;