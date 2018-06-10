'use strict';


let Sharing = Backbone.View.extend({
    template: `
        <a style="display: none;" href="#" class="b-social-btn type-fb" data-share-link="facebook"></a>
        <a style="display: none;" href="#" class="b-social-btn type-gp" data-share-link="gplus"></a>
        <a href="#" class="b-social-btn type-tw" data-share-link="twitter"></a>
        <a href="#" class="b-social-btn type-ld" data-share-link="linkedin"></a>
     `,
    initialize(options) {
        this.params = options;
        this.config = {
            facebook: {
                sharerUrl: 'https://www.facebook.com/sharer/sharer.php?'
            },
            twitter: {
                sharerUrl: 'http://twitter.com/intent/tweet?'
            },
            linkedin: {
                sharerUrl: 'https://www.linkedin.com/shareArticle?'
            },
            gplus: {
                sharerUrl: 'https://plus.google.com/share?'
            }
        };

        this.init();
        this.updateSocialTags();
    },

    events: {
        'click [data-share-link]': '_onClickShare'
    },

    init() {
        if (!this.params.link) {
            this.params.link = location.href;
        }

        if (!this.params.title) {
            self.params.title = document.title;
        }

        this.urlBuilders = this._getSocialConfig();
    },

    render() {
        this.$el.html(this.template);
        return this;
    },

    _buildElements() {
        this.$shareLinks = this.$('[data-share-link]').attr('target', '_blank');

        this.$shareLinks.each( (index, element) => {
            const $el = $(element);
            $el.attr('href', this.urlBuilders[$el.attr('data-share-link')].bind(this)())
        });
    },

    _onClickShare(e) {
        e.preventDefault();

        if (!this.$shareLinks){
            this._buildElements();
        }

        const url = $(e.currentTarget).attr('href');

        window.open(url,
            'name',
            'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=500');
    },

    _getSocialConfig() {
        const self = this;

        return {
            facebook: function () {
                var data = {
                    u: self.params.link,
                    picture: self.params.image,
                    source: self.params.source,
                    t: self.params.title,
                    text: self.params.summary
                };

                for (var param in data) {
                    if (data.hasOwnProperty(param) && !data[param]) {
                        delete data[param];
                    }
                }

                return self.config.facebook.sharerUrl + $.param(data);
            },
            twitter: function () {
                var data = {
                    url: self.params.link,
                    text: self.params.summary,
                    via: self.config.twitter.via || null,
                    hashtags: self.params.hashtags || null,
                    related: self.params.related || null
                };

                for (var param in data) {
                    if (data.hasOwnProperty(param) && !data[param]) {
                        delete data[param];
                    }
                }

                return self.config.twitter.sharerUrl + $.param(data);
            },
            linkedin: function () {
                var data = {
                    url: self.params.link,
                    source: self.params.title,
                    summary: self.params.summary,
                    image: self.params.image,
                    mini: true
                };

                for (var param in data) {
                    if (data.hasOwnProperty(param) && !data[param]) {
                        delete data[param];
                    }
                }

                return self.config.linkedin.sharerUrl + $.param(data);
            },
            gplus: function () {
                var data = {
                    url: self.params.link
                };
                return self.config.gplus.sharerUrl + $.param(data);
            }
        }
    },

    updateSocialTags(){
        this.setTag('title', this.params.title);
        this.setTag('description', this.params.summary);
        this.setTag('url', this.params.link);
    },

    setTag(name, value){
        const $head = $('head');
        const $tag = $head.find(`[property="og:${name}"]`);

        if ($tag.length){
            $tag.attr('content', value);
        } else {
            $head.append(`<meta property="og:${name}" content="${value}">`);
        }
    }
});

export default Sharing;