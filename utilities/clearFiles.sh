#!/bin/bash

## delete split combine files after 7 days

### adjust paths from server

find /root/vinnovate/uploads-mocr/split_combine_files -mindepth 1 -mtime +7 -delete

find /root/vinnovate/uploads-mocr/report_listing_files -mindepth 1 -mtime +7 -delete

find /root/vinnovate/uploads-mocr/report_cleanup_files -mindepth 1 -mtime +7 -delete

find /root/vinnovate/uploads-mocr/client_report -mindepth 1 -mtime +7 -delete
